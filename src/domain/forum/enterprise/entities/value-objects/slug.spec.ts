import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const { value } = Slug.createFromText('Example_question--title test ')

  expect(value).toEqual('example-question-title-test')
})
