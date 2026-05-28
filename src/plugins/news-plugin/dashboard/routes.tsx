import {
  api,
  Badge,
  Button,
  createRelationSelectorConfig,
  DashboardRouteDefinition,
  DetailFormGrid,
  DetailPageButton,
  FormFieldWrapper,
  Input,
  Link,
  ListPage,
  Page,
  PageActionBar,
  PageActionBarRight,
  PageBlock,
  PageLayout,
  PageTitle,
  SingleRelationInput,
  Switch,
  Textarea,
  toast,
  useForm,
  useMutation,
  useNavigate,
  useQuery,
  useQueryClient,
  useWatch,
  VendureImage,
} from "@vendure/dashboard";
import type { AnyRoute } from "@vendure/dashboard";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo } from "react";

import { graphql } from "@/gql";

const storefrontNewsListDocument = graphql(`
  query StorefrontNewsList($options: StorefrontNewsListOptions) {
    storefrontNewsItems(options: $options) {
      items {
        id
        createdAt
        updatedAt
        title
        summary
        imageAsset {
          id
          name
          preview
        }
        sortOrder
        isPublished
      }
      totalItems
    }
  }
`);

const storefrontNewsDetailDocument = graphql(`
  query StorefrontNewsDetail($id: ID!) {
    getStorefrontNewsItem(newsId: $id) {
      id
      createdAt
      updatedAt
      title
      summary
      imageAsset {
        id
        name
        preview
        source
        mimeType
        fileSize
        width
        height
      }
      ctaText
      ctaLink
      sortOrder
      isPublished
    }
  }
`);

const createStorefrontNewsDocument = graphql(`
  mutation CreateStorefrontNews($input: CreateStorefrontNewsInput!) {
    createStorefrontNewsItem(input: $input) {
      id
      title
      summary
      ctaText
      ctaLink
      sortOrder
      isPublished
      imageAsset {
        id
        name
        preview
      }
    }
  }
`);

const updateStorefrontNewsDocument = graphql(`
  mutation UpdateStorefrontNews($id: ID!, $input: UpdateStorefrontNewsInput!) {
    updateStorefrontNewsItem(newsId: $id, input: $input) {
      id
      title
      summary
      ctaText
      ctaLink
      sortOrder
      isPublished
      imageAsset {
        id
        name
        preview
      }
    }
  }
`);

const deleteStorefrontNewsDocument = graphql(`
  mutation DeleteStorefrontNews($id: ID!) {
    deleteStorefrontNewsItem(newsId: $id)
  }
`);

const assetListDocument = graphql(`
  query AssetsForStorefrontNews($options: AssetListOptions) {
    assets(options: $options) {
      items {
        id
        name
        preview
        source
        mimeType
        fileSize
        width
        height
      }
      totalItems
    }
  }
`);

type StorefrontNewsFormValues = {
  title: string;
  summary: string;
  imageAssetId: string | null;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  isPublished: boolean;
};

export const storefrontNewsListRoute: DashboardRouteDefinition = {
  path: "/storefront-news",
  navMenuItem: {
    sectionId: "marketing",
    id: "storefront-news",
    title: "Noticias",
    url: "/storefront-news",
  },
  loader: () => ({
    breadcrumb: "Noticias",
  }),
  component: route => (
    <ListPage
      pageId="storefront-news-list"
      title="Noticias"
      listQuery={storefrontNewsListDocument}
      deleteMutation={deleteStorefrontNewsDocument}
      route={route}
      onSearchTermChange={searchTerm => ({
        title: { contains: searchTerm },
      })}
      customizeColumns={{
        imageAsset: {
          header: "Imagen",
          cell: ({ row }) =>
            row.original.imageAsset ? (
              <VendureImage
                asset={row.original.imageAsset}
                alt={row.original.title}
                preset="thumb"
                className="h-10 w-10 rounded object-cover"
              />
            ) : null,
        },
        title: {
          cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.title} />,
        },
        isPublished: {
          header: "Publicado",
          cell: ({ row }) => (
            <Badge variant="secondary">{row.original.isPublished ? "Si" : "No"}</Badge>
          ),
        },
      }}
      facetedFilters={{
        isPublished: {
          title: "Publicado",
          options: [
            { label: "Si", value: true },
            { label: "No", value: false },
          ],
        },
      }}
      defaultVisibility={{
        imageAsset: true,
        title: true,
        summary: true,
        sortOrder: true,
        isPublished: true,
      }}
      defaultColumnOrder={["imageAsset", "title", "summary", "sortOrder", "isPublished"]}
      defaultSort={[{ id: "sortOrder", desc: false }]}
    >
      <PageActionBarRight>
        <Button render={<Link to="./new" />}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Crear noticia
        </Button>
      </PageActionBarRight>
    </ListPage>
  ),
};

export const storefrontNewsDetailRoute: DashboardRouteDefinition = {
  path: "/storefront-news/$id",
  loader: () => ({
    breadcrumb: "Noticia",
  }),
  component: route => <StorefrontNewsDetailPage route={route} />,
};

function StorefrontNewsDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams();
  const creatingNewEntity = params.id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<StorefrontNewsFormValues>({
    defaultValues: {
      title: "",
      summary: "",
      imageAssetId: null,
      ctaText: "",
      ctaLink: "",
      sortOrder: 0,
      isPublished: true,
    },
  });

  const imageAssetId = useWatch({
    control: form.control,
    name: "imageAssetId",
  });

  const detailQuery = useQuery({
    queryKey: ["storefront-news-detail", params.id],
    queryFn: () => api.query(storefrontNewsDetailDocument, { id: params.id }),
    enabled: !creatingNewEntity,
  });

  const assetQuery = useQuery({
    queryKey: ["storefront-news-asset", imageAssetId],
    queryFn: () =>
      api.query(assetListDocument, {
        options: {
          take: 1,
          filter: { id: { eq: imageAssetId } },
        },
      }),
    enabled: !!imageAssetId,
  });

  useEffect(() => {
    const newsItem = detailQuery.data?.getStorefrontNewsItem;
    if (!newsItem) {
      return;
    }
    form.reset({
      title: newsItem.title,
      summary: newsItem.summary,
      imageAssetId: newsItem.imageAsset?.id ?? null,
      ctaText: newsItem.ctaText ?? "",
      ctaLink: newsItem.ctaLink ?? "",
      sortOrder: newsItem.sortOrder,
      isPublished: newsItem.isPublished,
    });
  }, [detailQuery.data, form]);

  const assetSelectorConfig = useMemo(
    () =>
      createRelationSelectorConfig({
        listQuery: assetListDocument,
        idKey: "id",
        labelKey: "name",
        placeholder: "Search assets...",
        buildSearchFilter: searchTerm => ({
          name: { contains: searchTerm },
        }),
        label: item => (
          <div className="flex items-center gap-2">
            <VendureImage
              asset={item as any}
              alt={item.name}
              preset="thumb"
              className="h-8 w-8 rounded object-cover"
            />
            <span>{item.name}</span>
          </div>
        ),
      }),
    []
  );

  const createMutation = useMutation({
    mutationFn: (input: StorefrontNewsFormValues) =>
      api.mutate(createStorefrontNewsDocument, { input: normalizeInput(input) }),
    onSuccess: async (data: any) => {
      const result = data.createStorefrontNewsItem;
      toast.success("Noticia creada correctamente");
      await queryClient.invalidateQueries({ queryKey: ["storefront-news-list"] });
      await navigate({ to: "/storefront-news/$id", params: { id: result.id } });
    },
    onError: err => {
      toast.error("Failed to create noticia", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: StorefrontNewsFormValues) =>
      api.mutate(updateStorefrontNewsDocument, { id: params.id, input: normalizeInput(input) }),
    onSuccess: async (data: any) => {
      const result = data.updateStorefrontNewsItem;
      toast.success("Noticia actualizada correctamente");
      form.reset({
        title: result.title,
        summary: result.summary,
        imageAssetId: result.imageAsset?.id ?? null,
        ctaText: result.ctaText ?? "",
        ctaLink: result.ctaLink ?? "",
        sortOrder: result.sortOrder,
        isPublished: result.isPublished,
      });
      await queryClient.invalidateQueries({ queryKey: ["storefront-news-detail", params.id] });
      await queryClient.invalidateQueries({ queryKey: ["storefront-news-list"] });
    },
    onError: err => {
      toast.error("Failed to update noticia", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.mutate(deleteStorefrontNewsDocument, { id: params.id }),
    onSuccess: async () => {
      toast.success("Noticia eliminada correctamente");
      await queryClient.invalidateQueries({ queryKey: ["storefront-news-list"] });
      await navigate({ to: "/storefront-news" });
    },
    onError: err => {
      toast.error("Failed to delete noticia", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const selectedAsset = assetQuery.data?.assets.items[0] ?? detailQuery.data?.getStorefrontNewsItem?.imageAsset;
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Page
      pageId="storefront-news-detail"
      form={form}
      submitHandler={form.handleSubmit(values => {
        if (creatingNewEntity) {
          createMutation.mutate(values);
        } else {
          updateMutation.mutate(values);
        }
      })}
    >
      <PageTitle>
        {creatingNewEntity ? "Nueva noticia" : detailQuery.data?.getStorefrontNewsItem?.title ?? "Noticia"}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          {!creatingNewEntity && (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteMutation.mutate()}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {creatingNewEntity ? "Create" : "Update"}
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="side" blockId="publication" title="Estado">
          <div className="space-y-6">
            <FormFieldWrapper
              control={form.control}
              name="isPublished"
              label="Visible en storefront"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="sortOrder"
              label="Orden"
              rules={{ required: "Order is required" }}
              render={({ field }) => (
                <Input
                  type="number"
                  value={field.value ?? 0}
                  onChange={event => field.onChange(Number(event.target.value))}
                />
              )}
            />
          </div>
        </PageBlock>

        <PageBlock column="main" blockId="content" title="Contenido">
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="title"
              label="Titulo"
              rules={{ required: "Title is required" }}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="summary"
              label="Resumen"
              rules={{ required: "Summary is required" }}
              render={({ field }) => <Textarea {...field} value={field.value ?? ""} rows={4} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="ctaText"
              label="Texto del boton"
              render={({ field }) => <Input {...field} value={field.value ?? ""} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="ctaLink"
              label="Enlace del boton"
              render={({ field }) => <Input {...field} value={field.value ?? ""} type="url" />}
            />
          </DetailFormGrid>

          <div className="space-y-6">
            <FormFieldWrapper
              control={form.control}
              name="imageAssetId"
              label="Imagen"
              renderFormControl={false}
              render={({ field }) => (
                <SingleRelationInput
                  {...field}
                  value={field.value ?? undefined}
                  config={assetSelectorConfig}
                  selectorLabel="Select image"
                />
              )}
            />
          </div>
        </PageBlock>

        {selectedAsset && (
          <PageBlock column="main" blockId="preview" title="Vista previa">
            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <VendureImage
                asset={selectedAsset}
                alt={form.watch("title") || selectedAsset.name}
                preset="medium"
                className="aspect-video w-full rounded object-cover"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{form.watch("title")}</h3>
                <p className="text-sm text-muted-foreground">{form.watch("summary")}</p>
                {form.watch("ctaText") && (
                  <Button type="button" variant="secondary" render={<a href={form.watch("ctaLink") || "#"} />}>
                    {form.watch("ctaText")}
                  </Button>
                )}
              </div>
            </div>
          </PageBlock>
        )}
      </PageLayout>
    </Page>
  );
}

function normalizeInput(input: StorefrontNewsFormValues) {
  return {
    title: input.title,
    summary: input.summary,
    imageAssetId: input.imageAssetId || null,
    ctaText: input.ctaText || null,
    ctaLink: input.ctaLink || null,
    sortOrder: Number(input.sortOrder ?? 0),
    isPublished: Boolean(input.isPublished),
  };
}
