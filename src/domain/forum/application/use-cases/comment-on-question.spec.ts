import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { faker } from "@faker-js/faker";

let questionRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      questionRepository,
      questionCommentsRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await questionRepository.create(question);

    const { questionComment } = await sut.execute({
      questionId: question.id.toString(),
      content: faker.lorem.text(),
      authorId: faker.name.fullName(),
    });

    expect(questionCommentsRepository.questionComments[0].id).toEqual(
      questionComment.id
    );
  });
});
