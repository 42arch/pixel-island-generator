import type { Params } from './params'

function toSearchParams(obj: Record<string, any>, sp: URLSearchParams, prefix = '') {
  for (const key of Object.keys(obj)) {
    const v = obj[key]
    if (v === undefined || v === null) continue
    const k = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(v)) {
      sp.set(k, JSON.stringify(v))
    } else if (typeof v === 'object') {
      toSearchParams(v as Record<string, any>, sp, k)
    } else {
      sp.set(k, String(v))
    }
  }
}

function parsePrimitive(value: string): any {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (value === 'undefined') return undefined
  if ((value.startsWith('{') || value.startsWith('['))) {
    try { return JSON.parse(value) } catch { /* ignore */ }
  }
  const n = Number(value)
  if (!Number.isNaN(n) && value.trim() !== '') return n
  return value
}

function setDeep(target: Record<string, any>, path: string, value: any) {
  const parts = path.split('.')
  let cur: Record<string, any> = target
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (i === parts.length - 1) {
      cur[p] = value
    } else {
      if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {}
      cur = cur[p]
    }
  }
}

export function setParamsInUrl(params: Params) {
  const url = new URL(window.location.href)
  url.search = ''
  toSearchParams(params as unknown as Record<string, any>, url.searchParams)
  window.history.replaceState({}, '', url.toString())
}

export function getParamsFromUrl(): Partial<Params> | null {
  const url = new URL(window.location.href)
  if (!url.search || url.search.length <= 1) return null
  const out: Record<string, any> = {}
  url.searchParams.forEach((value, key) => {
    setDeep(out, key, parsePrimitive(value))
  })
  return out as Partial<Params>
}

export function mergeParams<T extends Record<string, any>>(target: T, source: any): T {
  if (!source || typeof source !== 'object') return target
  for (const k of Object.keys(source)) {
    const sv = source[k]
    const tv = (target as any)[k]
    if (Array.isArray(sv)) {
      (target as any)[k] = sv.slice()
    } else if (sv && typeof sv === 'object' && tv && typeof tv === 'object') {
      mergeParams(tv, sv)
    } else {
      (target as any)[k] = sv
    }
  }
  return target
}