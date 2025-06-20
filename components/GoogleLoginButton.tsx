'use client';

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
    return (
        <button
            onClick = {() => signIn('google', {callbackUrl: '/profile' })}
            className = "w-full bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
        >
            Googleでログイン / 新規登録
        </button>
    )
}