import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it("should be able to fetch recent questions", async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) })
    );
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) })
    );
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) })
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toHaveLength(3);
  });

  it("should be able to fetch paginanted recent questions", async () => {
    for (let index = 1; index <= 22; index++) {
      await questionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toHaveLength(2);
  });
});
