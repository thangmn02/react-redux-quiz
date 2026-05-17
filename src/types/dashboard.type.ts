export interface ICategory {
  id: number,
  name: string
}

export interface IPayloadSettingQuestion {
  category: string,
  difficulty: string,
  type: string,
  amount: number
}