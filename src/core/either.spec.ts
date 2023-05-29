import { Either, Left, Right, left, right } from "./either"

function doSomething(shouldSucess: boolean): Either<string,string> {
    if(shouldSucess) {
        return right('sucess')
    } else {
        return left('error')
    }
}

test('sucess result', () => {
    const sucessResult = doSomething(true)

    expect(sucessResult.isRight()).toBe(true)
    expect(sucessResult.isLeft()).toBe(false)
    expect(sucessResult.value).toBe('sucess')
})

test('error result', () => {
    const errorResult = doSomething(false)

    expect(errorResult.isLeft()).toBe(true)
    expect(errorResult.isRight()).toBe(false)
    expect(errorResult.value).toBe('error')
})