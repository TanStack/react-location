import { readFile, readdir } from 'fs/promises'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  getCodeSplitReferenceRoute,
  getCodeSplitVirtualRoute,
} from '../src/compilers'
import { splitPrefix } from '../src/constants'

async function getFilenames() {
  return await readdir(path.resolve(__dirname, './code-splitter/test-files'))
}

describe('code-splitter works', async () => {
  const filenames = await getFilenames()

  it.each(filenames)(
    'should handle the compiling and splitting of "%s"',
    async (filename) => {
      const file = await readFile(
        path.resolve(__dirname, `./code-splitter/test-files/${filename}`),
      )
      const code = file.toString()

      const referenceRouteResult = getCodeSplitReferenceRoute({
        code,
        root: './code-splitter/test-files',
        filename,
      })

      await expect(referenceRouteResult.code).toMatchFileSnapshot(
        `./code-splitter/snapshots/${filename}`,
        `New Compiled file for "${filename}" should match snapshot`,
      )

      const splitRouteResult = getCodeSplitVirtualRoute({
        code,
        root: './code-splitter/test-files',
        filename: `${filename}?${splitPrefix}`,
      })

      await expect(splitRouteResult.code).toMatchFileSnapshot(
        `./code-splitter/snapshots/${filename.replace('.tsx', '')}@split.tsx`,
        `Split file for "${filename}" should match snapshot`,
      )
    },
  )
})
