import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
    public answers: Answer[] = []

    async findById(answerId: string): Promise<Answer | null> {
        const answer = this.answers.find(answer => answer.id.toString() === answerId)

        if(!answer) {
            return null
        }

        return answer
    }
    async delete(answer: Answer): Promise<void> {
        const index = this.answers.findIndex(item => item.id === answer.id)

        this.answers.splice(index, 1)
    }

    async update(answer: Answer) {
        const index = this.answers.findIndex(item => item.id === answer.id)

        this.answers[index] = answer
    }

    async create(answer: Answer) {
        this.answers.push(answer)
    }
}