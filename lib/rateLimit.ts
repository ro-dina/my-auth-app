// レートリミット
type AttemptRecord = {
    count: number
    lastAttempt: number
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000 //10分

// IP or emailなどをキーにして制限
const attempts = new Map<string, AttemptRecord>()

export function isRateLimited(key: string): boolean{
    const now = Date.now()
    const record = attempts.get(key)

    if (!record){
        attempts.set(key, {count: 1, lastAttempt: now})
        return false
    }

    //ウィンドウ期間外ならリセット
    if (now - record.lastAttempt > WINDOW_MS) {
        attempts.set(key, { count: 1, lastAttempt: now })
        return false
    }

    //試行回数
    if (record.count >= MAX_ATTEMPTS){
        return true
    }

    //カウント
    attempts.set(key, { count: record.count + 1, lastAttempt: now})
    return false
}