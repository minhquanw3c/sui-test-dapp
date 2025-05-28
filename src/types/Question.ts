export interface Answer {
  id: number;
  Title: string;
  IsCorrect: Boolean;
}

export interface Question {
  documentId: string;
  Title: string;
  updatedAt: string;
  Score: number;
  Answers: Array<Answer>;
}
