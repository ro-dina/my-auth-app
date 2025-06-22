'use client'
import { useState } from 'react'

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold mb-4">利用規約</h1>
          <p className="mb-4">この利用規約（以下「本規約」）は、本アプリケーション（以下「当アプリ」）の利用に関する条件を定めるものです。</p>

          <h2 className="text-xl font-semibold mt-6">1. 適用</h2>
          <p>本規約は、ユーザーと当アプリ運営者との間の当アプリの利用に関わる一切の関係に適用されます。</p>

          <h2 className="text-xl font-semibold mt-6">2. 利用登録</h2>
          <p>登録希望者が運営者の定める方法によって利用登録を申請し、運営者がこれを承認することによって、利用登録が完了します。</p>

          <h2 className="text-xl font-semibold mt-6">3. 禁止事項</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>当アプリの運営を妨害する行為</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. 本サービスの提供の停止</h2>
          <p>運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく、当アプリの全部または一部の提供を停止または中断することができます。</p>

          <h2 className="text-xl font-semibold mt-6">5. 免責事項</h2>
          <p>当アプリの利用に関連してユーザーに生じたあらゆる損害について、運営者は一切の責任を負いません。</p>

          <h2 className="text-xl font-semibold mt-6">6. 利用規約の変更</h2>
          <p>運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができます。</p>

          <p className="mt-6 text-sm text-gray-500">この利用規約は、日本語版が正式版として優先されます。</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
          <p className="mb-4">
            These Terms of Service (&quot;Terms&quot;) govern your use of this application (&quot;App&quot;).
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Application</h2>
          <p>These Terms apply to all relationships between the user and the operator of the App regarding the use of the App.</p>

          <h2 className="text-xl font-semibold mt-6">2. Registration</h2>
          <p>Users must apply for registration using the method specified by the operator, and the registration is completed when approved by the operator.</p>

          <h2 className="text-xl font-semibold mt-6">3. Prohibited Actions</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>Acts that violate laws or public order and morals</li>
            <li>Acts related to criminal activity</li>
            <li>Acts that interfere with the operation of the App</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Suspension of the Service</h2>
          <p>The operator may suspend or interrupt all or part of the App without prior notice if it deems any of the following apply.</p>

          <h2 className="text-xl font-semibold mt-6">5. Disclaimer</h2>
          <p>The operator shall not be liable for any damages incurred by the user in relation to the use of the App.</p>

          <h2 className="text-xl font-semibold mt-6">6. Changes to Terms</h2>
          <p>The operator may change these Terms at any time without prior notice if deemed necessary.</p>

          <p className="mt-6 text-sm text-gray-500">The Japanese version of these Terms shall take precedence as the official version.</p>
        </div>
      )}
    </div>
  )
}
