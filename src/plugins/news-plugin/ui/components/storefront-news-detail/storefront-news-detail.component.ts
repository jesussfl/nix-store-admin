import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Asset as AdminAsset, LanguageCode, NotificationService, SharedModule, TypedBaseDetailComponent } from "@vendure/admin-ui/core";
import { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";

type StorefrontNewsEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  summary: string;
  imageAsset?: {
    id: string;
    preview: string;
    source: string;
    name: string;
  } | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type GetStorefrontNewsItemQuery = {
  getStorefrontNewsItem: StorefrontNewsEntity | null;
};

type GetStorefrontNewsItemQueryVariables = {
  id: string;
};

type CreateStorefrontNewsItemMutation = {
  createStorefrontNewsItem: {
    id: string;
  };
};

type CreateStorefrontNewsItemMutationVariables = {
  input: {
    title: string;
    summary: string;
    imageAssetId?: string | null;
    ctaText?: string | null;
    ctaLink?: string | null;
    sortOrder?: number | null;
    isPublished?: boolean | null;
  };
};

type UpdateStorefrontNewsItemMutation = {
  updateStorefrontNewsItem: {
    id: string;
  };
};

type UpdateStorefrontNewsItemMutationVariables = {
  id: string;
  input: CreateStorefrontNewsItemMutationVariables["input"];
};

type DeleteStorefrontNewsItemMutation = {
  deleteStorefrontNewsItem: boolean;
};

type DeleteStorefrontNewsItemMutationVariables = {
  id: string;
};

export const getStorefrontNewsDetailDocument = gql`
  query GetStorefrontNewsItem($id: ID!) {
    getStorefrontNewsItem(newsId: $id) {
      id
      createdAt
      updatedAt
      title
      summary
      imageAsset {
        id
        preview
        source
        name
      }
      ctaText
      ctaLink
      sortOrder
      isPublished
    }
  }
` as TypedDocumentNode<GetStorefrontNewsItemQuery, GetStorefrontNewsItemQueryVariables>;

const createStorefrontNewsDocument = gql`
  mutation CreateStorefrontNewsItem($input: CreateStorefrontNewsInput!) {
    createStorefrontNewsItem(input: $input) {
      id
    }
  }
` as TypedDocumentNode<CreateStorefrontNewsItemMutation, CreateStorefrontNewsItemMutationVariables>;

const updateStorefrontNewsDocument = gql`
  mutation UpdateStorefrontNewsItem($id: ID!, $input: UpdateStorefrontNewsInput!) {
    updateStorefrontNewsItem(newsId: $id, input: $input) {
      id
    }
  }
` as TypedDocumentNode<UpdateStorefrontNewsItemMutation, UpdateStorefrontNewsItemMutationVariables>;

const deleteStorefrontNewsDocument = gql`
  mutation DeleteStorefrontNewsItem($id: ID!) {
    deleteStorefrontNewsItem(newsId: $id)
  }
` as TypedDocumentNode<DeleteStorefrontNewsItemMutation, DeleteStorefrontNewsItemMutationVariables>;

@Component({
  selector: "storefront-news-detail",
  templateUrl: "./storefront-news-detail.component.html",
  styleUrls: ["./storefront-news-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class StorefrontNewsDetailComponent extends TypedBaseDetailComponent<typeof getStorefrontNewsDetailDocument, "getStorefrontNewsItem"> implements OnInit, OnDestroy {
  selectedAsset: AdminAsset | undefined;
  detailForm = this.formBuilder.group({
    title: ["", Validators.required],
    summary: ["", Validators.required],
    imageAssetId: [""],
    ctaText: [""],
    ctaLink: [""],
    sortOrder: [0, Validators.required],
    isPublished: [true],
  });

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  create(): void {
    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched();
      return;
    }

    this.dataService
      .mutate(createStorefrontNewsDocument, {
        input: this.getInput(),
      })
      .subscribe({
        next: () => {
          this.notificationService.success("Noticia creada correctamente");
          this.router.navigate(["/extensions", "storefront-news"]);
        },
      });
  }

  update(): void {
    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched();
      return;
    }

    this.dataService
      .mutate(updateStorefrontNewsDocument, {
        id: this.id,
        input: this.getInput(),
      })
      .subscribe({
        next: () => {
          this.notificationService.success("Noticia actualizada correctamente");
          this.detailForm.markAsPristine();
        },
      });
  }

  delete(): void {
    this.dataService
      .mutate(deleteStorefrontNewsDocument, {
        id: this.id,
      })
      .subscribe({
        next: () => {
          this.notificationService.success("Noticia eliminada correctamente");
          this.router.navigate(["/extensions", "storefront-news"]);
        },
      });
  }

  protected setFormValues(entity: NonNullable<ResultOf<typeof getStorefrontNewsDetailDocument>["getStorefrontNewsItem"]>, _languageCode: LanguageCode): void {
    this.detailForm.patchValue({
      title: entity.title,
      summary: entity.summary,
      imageAssetId: entity.imageAsset?.id ?? "",
      ctaText: entity.ctaText ?? "",
      ctaLink: entity.ctaLink ?? "",
      sortOrder: entity.sortOrder,
      isPublished: entity.isPublished,
    });
    this.selectedAsset = entity.imageAsset
      ? ({
          ...entity.imageAsset,
          __typename: "Asset",
          createdAt: "",
          updatedAt: "",
          fileSize: 0,
          mimeType: "",
          type: "IMAGE",
          width: 0,
          height: 0,
          focalPoint: null,
          tags: [],
        } as AdminAsset)
      : undefined;
    this.detailForm.markAsPristine();
  }

  onAssetChange(event: { featuredAsset: AdminAsset | undefined }): void {
    this.selectedAsset = event.featuredAsset;
    this.detailForm.patchValue({
      imageAssetId: event.featuredAsset?.id ?? "",
    });
    this.detailForm.markAsDirty();
  }

  private getInput() {
    const rawValue = this.detailForm.getRawValue();
    return {
      title: rawValue.title ?? "",
      summary: rawValue.summary ?? "",
      imageAssetId: rawValue.imageAssetId || null,
      ctaText: rawValue.ctaText || null,
      ctaLink: rawValue.ctaLink || null,
      sortOrder: Number(rawValue.sortOrder ?? 0),
      isPublished: Boolean(rawValue.isPublished),
    };
  }
}
