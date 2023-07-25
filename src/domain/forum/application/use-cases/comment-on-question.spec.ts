import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { faker } from "@faker-js/faker";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let questionRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    questionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      questionRepository,
      questionCommentsRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await questionRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toString(),
      content: faker.lorem.text(),
      authorId: faker.name.fullName(),
    });

    expect(result.isRight()).toEqual(true);
  });
});
