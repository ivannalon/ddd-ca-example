import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeQuestion } from "test/factories/make-question";

let questionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(questionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("first-question"),
    });

    await questionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "first-question",
    });

    expect(result.isRight()).toBe(true)
    expect(result.value?.question._id).toBe(newQuestion.id);
  });
});
