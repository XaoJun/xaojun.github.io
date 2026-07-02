const PHOTO_BASE_URL = 'http://106.75.13.191:19000/yanjun/'

export const PHOTO_FILE_NAMES = [
  '微信图片_20260701220527_110_148.jpg',
  '微信图片_20260701220530_111_148.jpg',
  '微信图片_20260701220534_112_148.jpg',
  '微信图片_20260701220537_113_148.jpg',
  '微信图片_20260701220540_114_148.jpg',
  '微信图片_20260701220544_115_148.jpg',
  '微信图片_20260701220547_116_148.jpg',
  '微信图片_20260701220548_117_148.jpg',
  '微信图片_20260701220550_118_148.jpg',
  '微信图片_20260701220552_119_148.jpg',
  '微信图片_20260701221700_120_148.jpg',
  '微信图片_20260701221756_121_148.png',
]

export const getPhotoUrl = (fileName) => `${PHOTO_BASE_URL}${encodeURIComponent(fileName)}`

export const getPhotoDate = (fileName) => {
  const dateMatch = fileName.match(/(\d{4})(\d{2})(\d{2})/)
  return dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '2026-07-01'
}
