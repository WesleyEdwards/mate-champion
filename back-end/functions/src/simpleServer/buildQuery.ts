import {EndpointBuilderType} from "../controllers/controller"
import {SafeParsable, checkValidSchema, isValid} from "./request_body"

export const buildQuery = <T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<T>
}) => {
  const intermediate: EndpointBuilderType<T> = async (info) => {
    if (params.validator) {
      const valid = checkValidSchema(info.req.body, params.validator)
      if (!isValid(valid)) {
        return info.res.status(400).json({error: valid})
      }
    }

    return params.fun(info)
  }

  return intermediate
}
