import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../internal";

const keyRegex = /Key \(([^)]+)\)=\(([^)]+)\)/;

const extractEntries = (detail: string) => {
  const matches = detail.match(keyRegex);
  console.log(matches);
  if (!matches || matches.length < 3) return {};
  const keys = matches[1]!
    .replace('"', "")
    .split(",")
    .map((key) => key.trim());
  console.log(keys);
  const values = matches[2]!.split(",").map((value) => value.trim());
  console.log(values);
  return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // PostgreSQL duplicate key
  if (err.code === "23505") {
    let duplicateEntries = extractEntries(err.detail);
    if (err.table === "attributes") {
      error = HttpError.validation([
        `Duplicate ${duplicateEntries["type"]} "${duplicateEntries["value"]}" entered`,
      ]);
    } else {
      error = HttpError.duplicateFields(Object.keys(duplicateEntries));
    }
  }

  // PostgreSQL validation error
  if (err.code === "23502") {
    let invalidEntries = extractEntries(err.detail);
    error = HttpError.invalidParameters(Object.keys(invalidEntries));
  }

  // PostgreSQL relation error
  if (err.code === "23503") {
    let invalidEntries = extractEntries(err.detail);
    error = HttpError.validation(
      Object.entries(invalidEntries).map(
        (entry) => `${entry[1]} is not a valid ${entry[0]}`
      )
    );
  }

  // PostgreSQL Invalid integer error
  if (err.code === "22P02") {
    error = HttpError.validation(["Cannot convert given value to a number"]);
  }

  if (!error.statusCode) {
    // Log to console for dev
    console.log(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    code: error.code || "server-error",
    message: error.message,
    ...(error.errors ? { errors: error.errors } : {}),
  });
};

export { errorHandler };
