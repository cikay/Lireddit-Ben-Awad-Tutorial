import namor from 'namor'

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function fillObject() {
  const randomTitleNum = random(1, 2)
  const randomTextNum = random(1, 4)
  return {
    title: namor.generate({ words: randomTitleNum, numbers: 0 }),
    text: namor.generate({ words: randomTextNum, numbers: 0 }),
  }
}

export default function makeData(len: number) {
  return range(len).map(() => fillObject())
}
