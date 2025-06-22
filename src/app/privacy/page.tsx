'use client'
import { useState } from 'react'

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja')

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          className={`mr-2 px-4 py-1 rounded ${lang === 'ja' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setLang('ja')}
        >
          日本語
        </button>
        <button
          className={`px-4 py-1 rounded ${lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setLang('en')}
        >
          English
        </button>
      </div>

      {lang === 'ja' ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>
          <p className="mb-4">当アプリは、ユーザーのプライバシーを尊重し、個人情報の適切な管理に努めます。</p>
          
          <h2 className="text-xl font-semibold mt-6">1. 収集する情報</h2>
          <p>本サービスは、Googleログインやメールアドレスによる認証を通じて、以下の情報を収集します：</p>
          <ul className="list-disc pl-5 mb-4">
            <li>メールアドレス</li>
            <li>ユーザー名</li>
            <li>プロフィール画像（Googleログインの場合）</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. 利用目的</h2>
          <p>収集した情報は、以下の目的のみに使用されます：</p>
          <ul className="list-disc pl-5 mb-4">
            <li>ユーザー認証のため</li>
            <li>ユーザー間の適切な機能の提供のため</li>
            <li>不正利用防止やサービス改善のため</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. 第三者提供</h2>
          <p>収集した情報を、本人の同意なく第三者に提供することはありません（法令に基づく場合を除く）。</p>

          <h2 className="text-xl font-semibold mt-6">4. 改訂について</h2>
          <p>本ポリシーは必要に応じて改訂されます。重大な変更がある場合は、アプリ上で通知します。</p>

          <p className="mt-6 text-sm text-gray-500">このプライバシーポリシーは、日本語版が正式版として優先されます。</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">This app respects your privacy and is committed to protecting your personal data.</p>
          
          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <p>We collect the following information via Google login or email/password authentication:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Email address</li>
            <li>User name</li>
            <li>Profile picture (for Google login)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. Purpose of Use</h2>
          <p>Collected data will be used solely for:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>User authentication</li>
            <li>Providing features between users</li>
            <li>Preventing misuse and improving the service</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Third-Party Disclosure</h2>
          <p>We do not share personal data with third parties without user consent unless required by law.</p>

          <h2 className="text-xl font-semibold mt-6">4. Updates to This Policy</h2>
          <p>This policy may be updated from time to time. Significant changes will be notified within the app.</p>

          <p className="mt-6 text-sm text-gray-500">
            The Japanese version of this policy shall take precedence as the official version.
          </p>
        </div>
      )}
    </div>
  )
}