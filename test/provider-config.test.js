import getSrc from '../src/provider-config'

describe('alibaba', () => {
  const src = 'http://image-demo.oss-cn-hangzhou.aliyuncs.com/panda.png'
  test('浏览器支持webp', () => {
    expect(
      getSrc({
        provider: 'alibaba',
        src,
        isSupportWebp: true
      })
    ).toBe(`${src}?x-oss-process=image/format,webp/quality,Q_75`)
  })
  test('浏览器不支持webp', () => {
    expect(
      getSrc({
        provider: 'alibaba',
        src,
        isSupportWebp: false
      })
    ).toBe(`${src}?x-oss-process=image/quality,Q_75`)
  })
  test('浏览器支持webp，但图片不是(png|jpe?g)', () => {
    const webp = src.replace('png', 'webp')
    expect(
      getSrc({
        provider: 'alibaba',
        src: webp,
        isSupportWebp: true
      })
    ).toBe(`${webp}?x-oss-process=image/quality,Q_75`)
  })
  test('svg不处理，除非有extraQuery', () => {
    const svg = src.replace('png', 'svg')
    const extraQuery = 'rotate,10'
    expect(getSrc({provider: 'alibaba', src: svg})).toBe(svg)
    expect(
      getSrc({
        provider: 'alibaba',
        src: svg,
        extraQuery
      })
    ).toBe(`${svg}?x-oss-process=image/${extraQuery}`)
  })
  test('带extraQuery的情况', () => {
    const extraQuery = 'rotate,10'
    expect(
      getSrc({
        provider: 'alibaba',
        src,
        isSupportWebp: true,
        extraQuery
      })
    ).toBe(`${src}?x-oss-process=image/format,webp/quality,Q_75/${extraQuery}`)
  })
})

describe('qiniu', () => {
  const src = 'https://odum9helk.qnssl.com/resource/gogopher.jpg'
  test('浏览器支持webp', () => {
    expect(
      getSrc({
        provider: 'qiniu',
        src,
        isSupportWebp: true
      })
    ).toBe(`${src}?imageMogr2/format/webp/quality/75`)
  })
  test('浏览器不支持webp', () => {
    expect(
      getSrc({
        provider: 'qiniu',
        src,
        isSupportWebp: false
      })
    ).toBe(`${src}?imageMogr2/quality/75`)
  })
  test('浏览器支持webp，但图片不是(png|jpe?g)', () => {
    const webp = src.replace('jpg', 'webp')
    expect(
      getSrc({
        provider: 'qiniu',
        src: webp,
        isSupportWebp: true
      })
    ).toBe(`${webp}?imageMogr2/quality/75`)
  })
  test('svg不处理', () => {
    const svg = src.replace('jpg', 'svg')
    expect(getSrc({provider: 'qiniu', src: svg})).toBe(svg)
  })
  test('带extraQuery的情况', () => {
    const extraQuery = 'rotate/10'
    expect(
      getSrc({
        provider: 'qiniu',
        src,
        isSupportWebp: true,
        extraQuery
      })
    ).toBe(`${src}?imageMogr2/format/webp/quality/75/${extraQuery}`)
  })
})

describe('self', () => {
  test('精确的资源路径', () => {
    const src = 'https://cumming.com/creampie.png'
    expect(
      getSrc({
        provider: 'self',
        src,
        isSupportWebp: true
      })
    ).toBe(`${src}.webp`)
  })

  test('带参数的资源路径', () => {
    const src = 'https://cumming.com/creampie.png'
    const query = '?format/jpeg'
    expect(
      getSrc({
        provider: 'self',
        src: src + query,
        isSupportWebp: true
      })
    ).toBe(`${src}.webp${query}`)
  })

  test('资源路径存在相同后缀名', () => {
    const src = 'https://cumming.com/creampie.png.creampie.png'
    expect(
      getSrc({
        provider: 'self',
        src,
        isSupportWebp: true
      })
    ).toBe(`${src}.webp`)
  })

  test('使用本地资源路径', () => {
    const src = './com/creampie.png.creampie.png'
    expect(
      getSrc({
        provider: 'self',
        src,
        isSupportWebp: true
      })
    ).toBe(`${src}.webp`)
  })

  test('默认情况下不转换svg', () => {
    const src = './com/creampie.png.creampie.svg'
    expect(
      getSrc({
        provider: 'self',
        src,
        isSupportWebp: true
      })
    ).toBe(src)
  })
})
