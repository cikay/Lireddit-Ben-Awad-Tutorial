import DataLoader from 'dataloader'
import { Updoot } from '../entities/Updoot'

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any)
      const idToUpdoot: Record<string, Updoot> = {}

      for (const updoot of updoots) {
        idToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot
      }
      return keys.map((key) => idToUpdoot[`${key.userId}|${key.postId}`])
    }
  )
