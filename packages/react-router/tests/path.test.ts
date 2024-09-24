import { describe, expect, it } from 'vitest'
import {
  exactPathTest,
  getLastPathSegment,
  interpolatePath,
  removeBasepath,
  removeTrailingSlash,
  resolvePath,
} from '../src/path'

describe('removeBasepath', () => {
  it.each([
    {
      name: '`/` should leave pathname as-is',
      basepath: '/',
      pathname: '/path',
      expected: '/path',
    },
    {
      name: 'should return empty string if basepath is the same as pathname',
      basepath: '/path',
      pathname: '/path',
      expected: '',
    },
    {
      name: 'should remove basepath from the beginning of the pathname',
      basepath: '/app',
      pathname: '/app/path/app',
      expected: '/path/app',
    },
    {
      name: 'should remove multisegment basepath from the beginning of the pathname',
      basepath: '/app/new',
      pathname: '/app/new/path/app/new',
      expected: '/path/app/new',
    },
    {
      name: 'should remove basepath only in case it matches segments completely',
      basepath: '/app',
      pathname: '/application',
      expected: '/application',
    },
    {
      name: 'should remove multisegment basepath only in case it matches segments completely',
      basepath: '/app/new',
      pathname: '/app/new-application',
      expected: '/app/new-application',
    },
  ])('$name', ({ basepath, pathname, expected }) => {
    expect(removeBasepath(basepath, pathname)).toBe(expected)
  })
})

describe.each([{ basepath: '/' }, { basepath: '/app' }, { basepath: '/app/' }])(
  'removeTrailingSlash with basepath $basepath',
  ({ basepath }) => {
    it('should remove trailing slash if present', () => {
      const input = 'https://example.com/'
      const expectedOutput = 'https://example.com'
      const result = removeTrailingSlash(input, basepath)
      expect(result).toBe(expectedOutput)
    })
    it('should not modify the string if no trailing slash present', () => {
      const input = 'https://example.com'
      const result = removeTrailingSlash(input, basepath)
      expect(result).toBe(input)
    })
    it('should handle empty string', () => {
      const input = ''
      const result = removeTrailingSlash(input, basepath)
      expect(result).toBe(input)
    })
    it('should handle strings with only a slash', () => {
      const input = '/'
      const result = removeTrailingSlash(input, basepath)
      expect(result).toBe(input)
    })
    it('should handle strings with multiple slashes', () => {
      const input = 'https://example.com/path/to/resource/'
      const expectedOutput = 'https://example.com/path/to/resource'
      const result = removeTrailingSlash(input, basepath)
      expect(result).toBe(expectedOutput)
    })
  },
)

describe.each([{ basepath: '/' }, { basepath: '/app' }, { basepath: '/app/' }])(
  'exactPathTest with basepath $basepath',
  ({ basepath }) => {
    it('should return true when two paths are exactly the same', () => {
      const path1 = 'some-path/additional-path'
      const path2 = 'some-path/additional-path'
      const result = exactPathTest(path1, path2, basepath)
      expect(result).toBe(true)
    })
    it('should return true when two paths are the same with or without trailing slash', () => {
      const path1 = 'some-path/additional-path'
      const path2 = 'some-path/additional-path/'
      const result = exactPathTest(path1, path2, basepath)
      expect(result).toBe(true)
    })
    it('should return true when two paths are the same with or without trailing slash 2', () => {
      const path1 = 'some-path/additional-path'
      const path2 = 'some-path/additional-path/'
      const result = exactPathTest(path1, path2, basepath)
      expect(result).toBe(true)
    })
    it('should return false when two paths are different', () => {
      const path1 = 'some-path/additional-path/'
      const path2 = 'some-path2/additional-path/'
      const result = exactPathTest(path1, path2, basepath)
      expect(result).toBe(false)
    })
    it('should return true when both paths are just a slash', () => {
      const path1 = '/'
      const path2 = '/'
      const result = exactPathTest(path1, path2, basepath)
      expect(result).toBe(true)
    })
  },
)

describe('resolvePath', () => {
  describe.each([
    ['/', '/', '/', '/'],
    ['/', '/', '/a', '/a'],
    ['/', '/', 'a/', '/a'],
    ['/', '/', '/a/b', '/a/b'],
    ['/', 'a', 'b', '/a/b'],
    ['/a/b', 'c', '/a/b/c', '/a/b/c'],
    ['/a/b', '/', 'c', '/a/b/c'],
    ['/a/b', '/', './c', '/a/b/c'],
    ['/', '/', 'a/b', '/a/b'],
    ['/', '/', './a/b', '/a/b'],
    ['/', '/a/b/c', 'd', '/a/b/c/d'],
    ['/', '/a/b/c', './d', '/a/b/c/d'],
    ['/', '/a/b/c', './../d', '/a/b/d'],
    ['/', '/a/b/c/d', './../d', '/a/b/c/d'],
    ['/', '/a/b/c', '../d', '/a/b/d'],
    ['/', '/a/b/c', '../../d', '/a/d'],
    ['/', '/a/b/c', '..', '/a/b'],
    ['/', '/a/b/c', '../..', '/a'],
    ['/', '/a/b/c', '../../..', '/'],
    ['/', '/a/b/c/', '../../..', '/'],
    ['/products', '/', '/products-list', '/products/products-list'],
  ])('resolves correctly', (base, a, b, eq) => {
    it(`Base: ${base} - ${a} to ${b} === ${eq}`, () => {
      expect(resolvePath({ basepath: base, base: a, to: b })).toEqual(eq)
    })
    it(`Base: ${base} - ${a}/ to ${b} === ${eq} (trailing slash)`, () => {
      expect(resolvePath({ basepath: base, base: a + '/', to: b })).toEqual(eq)
    })
    it(`Base: ${base} - ${a}/ to ${b}/ === ${eq} (trailing slash + trailing slash)`, () => {
      expect(
        resolvePath({ basepath: base, base: a + '/', to: b + '/' }),
      ).toEqual(eq)
    })
  })
  describe('trailingSlash', () => {
    describe(`'always'`, () => {
      it('keeps trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd/',
            trailingSlash: 'always',
          }),
        ).toBe('/a/b/c/d/')
      })
      it('adds trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd',
            trailingSlash: 'always',
          }),
        ).toBe('/a/b/c/d/')
      })
    })
    describe(`'never'`, () => {
      it('removes trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd/',
            trailingSlash: 'never',
          }),
        ).toBe('/a/b/c/d')
      })
      it('does not add trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd',
            trailingSlash: 'never',
          }),
        ).toBe('/a/b/c/d')
      })
    })
    describe(`'preserve'`, () => {
      it('keeps trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd/',
            trailingSlash: 'preserve',
          }),
        ).toBe('/a/b/c/d/')
      })
      it('does not add trailing slash', () => {
        expect(
          resolvePath({
            basepath: '/',
            base: '/a/b/c',
            to: 'd',
            trailingSlash: 'preserve',
          }),
        ).toBe('/a/b/c/d')
      })
    })
  })
})

describe('interpolatePath', () => {
  ;[
    {
      name: 'should interpolate the path',
      path: '/users/$id',
      params: { id: '123' },
      result: '/users/123',
    },
    {
      name: 'should interpolate the path with multiple params',
      path: '/users/$id/$name',
      params: { id: '123', name: 'tanner' },
      result: '/users/123/tanner',
    },
    {
      name: 'should interpolate the path with extra params',
      path: '/users/$id',
      params: { id: '123', name: 'tanner' },
      result: '/users/123',
    },
    {
      name: 'should interpolate the path with missing params',
      path: '/users/$id/$name',
      params: { id: '123' },
      result: '/users/123/undefined',
    },
    {
      name: 'should interpolate the path with missing params and extra params',
      path: '/users/$id',
      params: { name: 'john' },
      result: '/users/undefined',
    },
    {
      name: 'should interpolate the path with the param being a number',
      path: '/users/$id',
      params: { id: 123 },
      result: '/users/123',
    },
    {
      name: 'should interpolate the path with the param being a falsey number',
      path: '/users/$id',
      params: { id: 0 },
      result: '/users/0',
    },
  ].forEach((exp) => {
    it(exp.name, () => {
      const result = interpolatePath({ path: exp.path, params: exp.params })
      expect(result).toBe(exp.result)
    })
  })
})

describe('getLastPathSegment', () => {
  it.each([
    {
      name: 'should return the last segment with leading slash when path ends with a slash',
      path: '/_protected/test/',
      expected: '/test',
    },
    {
      name: 'should return the last segment with leading slash when path does not end with a slash',
      path: '/_protected/test',
      expected: '/test',
    },
    {
      name: 'should return the last segment in a longer path with trailing slash',
      path: '/another/path/example/',
      expected: '/example',
    },
    {
      name: 'should return the last segment in a longer path without trailing slash',
      path: '/another/path/example',
      expected: '/example',
    },
    {
      name: 'should return the only segment with leading slash',
      path: '/single',
      expected: '/single',
    },
    {
      name: 'should return the last segment with leading slash in a nested path',
      path: '/trailing/slash/',
      expected: '/slash',
    },
    {
      name: 'should return undefined for root path',
      path: '/',
      expected: undefined,
    },
    {
      name: 'should return undefined for empty string',
      path: '',
      expected: undefined,
    },
    {
      name: 'should handle paths with numbers correctly',
      path: '/users/123/',
      expected: '/123',
    },
    {
      name: 'should handle paths with special characters',
      path: '/path/with-special_chars!',
      expected: '/with-special_chars!',
    },
    {
      name: 'should handle paths with multiple special characters and trailing slash',
      path: '/path/with/$pecial-Chars123/',
      expected: '/$pecial-Chars123',
    },
    {
      name: 'should return undefined when there is no segment after the last slash',
      path: '/path/to/directory//',
      expected: undefined,
    },
    {
      name: 'should handle paths without leading slash',
      path: 'no/leading/slash',
      expected: '/slash',
    },
    {
      name: 'should handle single slash',
      path: '/',
      expected: undefined,
    },
    {
      name: 'should handle path with multiple trailing slashes',
      path: '/multiple/trailing/slashes///',
      expected: undefined,
    },
  ])('$name', ({ path, expected }) => {
    expect(getLastPathSegment(path)).toBe(expected)
  })
})
