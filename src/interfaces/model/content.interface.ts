export interface Content {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildContent {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  parent: Content;
}

export interface ContentDetail extends Content {
  htmlContent: string;
  children: Array<Omit<ChildContent, "parent">>;
}

export interface ChildContentDetail extends ChildContent {
  htmlContent: string;
}
