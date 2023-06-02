export interface Hero {
  nickname: string,
  realName: string,
  originDescription: string,
  superpowers: string,
  catchPhrase: string,
  images: string[],
}

export interface HeroData {
  id: number,
  nickname: string,
  realName: string,
  originDescription: string,
  superpowers: string,
  catchPhrase: string,
  imagesURLs: string[][],
}
