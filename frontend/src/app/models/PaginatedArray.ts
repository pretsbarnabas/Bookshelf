import { BookModel } from "./Book";
import { CommentModel } from "./Comment";
import { ReviewModel } from "./Review";
import { SummaryModel } from "./Summary";
import { UserModel } from "./User";

export type PaginatedArray = UserModel[] | BookModel[] | ReviewModel[] | SummaryModel[] | CommentModel[];