import { createHash } from 'crypto'
import { createReadStream } from 'fs'

export default (filename: string, opts: any = {}) => {
  const { algorithm = 'sha1', encoding = 'hex' } = opts

  const hash = createHash(algorithm)
  hash.setEncoding(encoding)

  const fileStream = createReadStream(filename)
  fileStream.pipe(
    hash,
    { end: false }
  )

  return new Promise<string>((resolve, reject) => {
    fileStream.on('error', reject)
    fileStream.on('end', () => {
      hash.end()
      resolve(hash.read())
    })
  })
}
