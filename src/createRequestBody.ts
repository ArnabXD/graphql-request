// deno-lint-ignore-file no-explicit-any
import extractFiles, { ExtractableFile } from 'extract-files/extractFiles.mjs'
import isExtractableFile from 'extract-files/isExtractableFile.mjs'

import { Variables } from './types.ts'

/**
 * Duck type if NodeJS stream
 * https://github.com/sindresorhus/is-stream/blob/3750505b0727f6df54324784fe369365ef78841e/index.js#L3
 */
const isExtractableFileEnhanced = (value: any): value is ExtractableFile | { pipe: Function } =>
  isExtractableFile(value) ||
  (value !== null && typeof value === 'object' && typeof value.pipe === 'function')

/**
 * Returns Multipart Form if body contains files
 * (https://github.com/jaydenseric/graphql-multipart-request-spec)
 * Otherwise returns JSON
 */
export default function createRequestBody(
  query: string | string[],
  variables?: Variables | Variables[],
  operationName?: string
): string | FormData {
  const { clone, files } = extractFiles({ query, variables, operationName }, isExtractableFileEnhanced, '')

  if (files.size === 0) {
    if (!Array.isArray(query)) {
      return JSON.stringify(clone)
    }

    if (typeof variables !== 'undefined' && !Array.isArray(variables)) {
      throw new Error('Cannot create request body with given variable type, array expected')
    }

    // Batch support
    const payload = query.reduce<{ query: string; variables: Variables | undefined }[]>(
      (accu, currentQuery, index) => {
        accu.push({ query: currentQuery, variables: variables ? variables[index] : undefined })
        return accu
      },
      []
    )

    return JSON.stringify(payload)
  }

  const Form = typeof FormData === 'undefined' ? FormData : FormData

  const form = new Form()

  form.append('operations', JSON.stringify(clone))

  const map: { [key: number]: string[] } = {}
  let i = 0
  files.forEach((paths: string[]) => {
    map[++i] = paths
  })
  form.append('map', JSON.stringify(map))

  i = 0
  files.forEach((_paths: string[], file: string | Blob) => {
    form.append(`${++i}`, file)
  })

  return form as FormData
}
