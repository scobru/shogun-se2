"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { ShogunButton, ShogunButtonProvider } from "shogun-button-react";
import { ShogunCore } from "shogun-core";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initialize Shogun SDK
  const sdk = new ShogunCore({
    gundb: {
      peers: ["https://gun-relay.scobrudot.dev/gun"]
    },
    metamask: {
      enabled: true
    },
    webauthn: {
      enabled: true
    },
    peers: ["https://gun-relay.scobrudot.dev/gun"]
  });

  if (!mounted) {
    return null;
  }

  return (
    <ShogunButtonProvider 
      sdk={sdk}
      options={{
        appName: "Shogun Wallet App",
        appDescription: "A secure wallet application",
        appUrl: typeof window !== 'undefined' ? window.location.origin : '',
        darkMode: document.documentElement.getAttribute('data-theme') === 'dark',
        showMetamask: true,
        showWebauthn: true
      }}
      onLoginSuccess={(data) => {
        console.log("Login successful:", data);
        setIsLoggedIn(true);
        // Se il login è avvenuto con MetaMask, usa l'indirizzo dell'account
        if (data.authMethod === 'metamask_direct' || data.authMethod === 'metamask_saved') {
          setUserAddress(data.username);
        } else {
          setUserAddress(data.userPub);
        }
      }}
      onSignupSuccess={(data) => {
        console.log("Signup successful:", data);
        setIsLoggedIn(true);
        // Se la registrazione è avvenuta con MetaMask, usa l'indirizzo dell'account
        if (data.authMethod === 'metamask_signup') {
          setUserAddress(data.username);
        } else {
          setUserAddress(data.userPub);
        }
      }}
      onError={(error) => {
        console.error("Shogun error:", error);
        setIsLoggedIn(false);
        setUserAddress(null);
      }}
    >
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          
          {/* Add Shogun Button */}
          <div className="flex justify-center items-center space-y-4 mb-8">
            <ShogunButton />
          </div>

          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={isLoggedIn ? userAddress : connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ShogunButtonProvider>
  );
};

export default Home;
