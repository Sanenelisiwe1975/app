import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useGameStore } from "@/shared/stores/gameStore";
import type { NftMint } from "@/shared/stores/gameStore";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export type MintStatus =
  | "idle"
  | "requesting-airdrop"
  | "building"
  | "signing"
  | "confirming"
  | "success"
  | "error";

export function useSolanaDevnet(certId: string, certHash: string) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const recordNftMint = useGameStore((s) => s.recordNftMint);
  const existingMint  = useGameStore((s) => s.nftMint);

  const [status,  setStatus]  = useState<MintStatus>("idle");
  const [error,   setError]   = useState<string | null>(null);
  const [result,  setResult]  = useState<NftMint | null>(
    existingMint?.certId === certId ? existingMint : null
  );
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      // non-critical — ignore
    }
  }, [connection, publicKey]);

  const requestAirdrop = useCallback(async () => {
    if (!publicKey) return;
    setStatus("requesting-airdrop");
    setError(null);
    try {
      const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, ...latestBlockhash }, "confirmed");
      await fetchBalance();
      setStatus("idle");
    } catch (e) {
      setError(`Airdrop failed: ${e instanceof Error ? e.message : "try again"}`);
      setStatus("error");
    }
  }, [connection, publicKey, fetchBalance]);

  const mintCertificate = useCallback(async () => {
    if (!publicKey) return;
    setStatus("building");
    setError(null);
    try {
      const memoPayload = JSON.stringify({
        issuer:    "Xhosa Rise Global Holdings",
        certId,
        hash:      certHash,
        issuedAt:  new Date().toISOString(),
        network:   "devnet",
      });

      const instruction = new TransactionInstruction({
        keys:      [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data:      Buffer.from(memoPayload, "utf8"),
      });

      const latestBlockhash = await connection.getLatestBlockhash();
      const tx = new Transaction({
        recentBlockhash: latestBlockhash.blockhash,
        feePayer: publicKey,
      });
      tx.add(instruction);

      setStatus("signing");
      const signature = await sendTransaction(tx, connection);

      setStatus("confirming");
      await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      const mint: NftMint = { txSignature: signature, explorerUrl, mintedAt: Date.now(), certId };

      recordNftMint(mint);
      setResult(mint);
      setStatus("success");
      await fetchBalance();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed — check wallet & balance");
      setStatus("error");
    }
  }, [connection, publicKey, sendTransaction, certId, certHash, recordNftMint, fetchBalance]);

  return { status, error, result, balance, fetchBalance, requestAirdrop, mintCertificate };
}
