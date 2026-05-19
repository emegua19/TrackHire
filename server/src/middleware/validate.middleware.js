import { z } from "zod";

/**
 * Validation Middleware Factory
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} [source="body"] - Which part of request to validate (body, params, query)
 */
export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const dataToValidate = source === "body" 
        ? req.body 
        : source === "params" 
          ? req.params 
          : req.query;

      const validatedData = await schema.parseAsync(dataToValidate);
      
      // Replace request data with validated & sanitized data
      if (source === "body") req.body = validatedData;
      if (source === "params") req.params = validatedData;
      if (source === "query") req.query = validatedData;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      next(error);
    }
  };
};