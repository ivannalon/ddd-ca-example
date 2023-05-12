import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestion } from "test/factories/make-question";

let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it("should be able to fetch recent questions", async () => {
    await questionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 20)}))
    await questionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 18)}))
    await questionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 23)}))

    const { questions } = await sut.execute({
        page: 1
    });

    expect(questions).toEqual([
        expect.objectContaining({createdAt: new Date(2022, 0, 23)}),
        expect.objectContaining({createdAt: new Date(2022, 0, 20)}),
        expect.objectContaining({createdAt: new Date(2022, 0, 18)})
    ])
  });

  it("should be able to fetch paginanted recent questions", async () => {
    for (let index = 1; index <= 22; index++) {
        await questionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({
        page: 2
    });

    expect(questions).toHaveLength(2)
  });
});
