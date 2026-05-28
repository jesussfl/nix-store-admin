import {
  api,
  Button,
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
  Textarea,
  toast,
  useForm,
  useMutation,
  useNavigate,
  useQuery,
  useQueryClient,
} from "@vendure/dashboard";
import type { AnyRoute } from "@vendure/dashboard";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";

import { graphql } from "@/gql";

const loteListDocument = graphql(`
  query LoteList($options: LoteListOptions) {
    allLotes(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        description
      }
      totalItems
    }
  }
`);

const loteDetailDocument = graphql(`
  query LoteDetail($id: ID!) {
    getLote(loteId: $id) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`);

const createLoteDocument = graphql(`
  mutation CreateLote($input: CreateLoteInput!) {
    createLote(input: $input) {
      id
      name
      description
    }
  }
`);

const updateLoteDocument = graphql(`
  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {
    updateLote(loteId: $id, input: $input) {
      id
      name
      description
    }
  }
`);

const deleteLoteDocument = graphql(`
  mutation DeleteLote($id: ID!) {
    deleteLote(loteId: $id)
  }
`);

type LoteFormValues = {
  name: string;
  description: string;
};

export const loteListRoute: DashboardRouteDefinition = {
  path: "/lotes",
  navMenuItem: {
    sectionId: "catalog",
    id: "lotes",
    title: "Lotes",
    url: "/lotes",
  },
  loader: () => ({
    breadcrumb: "Lotes",
  }),
  component: route => (
    <ListPage
      pageId="lote-list"
      title="Lotes"
      listQuery={loteListDocument}
      deleteMutation={deleteLoteDocument}
      route={route}
      onSearchTermChange={searchTerm => ({
        name: { contains: searchTerm },
      })}
      customizeColumns={{
        name: {
          cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
        },
      }}
      defaultVisibility={{
        name: true,
        description: true,
      }}
      defaultColumnOrder={["name", "description"]}
      defaultSort={[{ id: "createdAt", desc: true }]}
    >
      <PageActionBarRight>
        <Button render={<Link to="./new" />}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create lote
        </Button>
      </PageActionBarRight>
    </ListPage>
  ),
};

export const loteDetailRoute: DashboardRouteDefinition = {
  path: "/lotes/$id",
  loader: () => ({
    breadcrumb: "Lote",
  }),
  component: route => <LoteDetailPage route={route} />,
};

function LoteDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams();
  const creatingNewEntity = params.id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<LoteFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const detailQuery = useQuery({
    queryKey: ["lote-detail", params.id],
    queryFn: () => api.query(loteDetailDocument, { id: params.id }),
    enabled: !creatingNewEntity,
  });

  useEffect(() => {
    const lote = detailQuery.data?.getLote;
    if (!lote) {
      return;
    }
    form.reset({
      name: lote.name,
      description: lote.description ?? "",
    });
  }, [detailQuery.data, form]);

  const createMutation = useMutation({
    mutationFn: (input: LoteFormValues) => api.mutate(createLoteDocument, { input }),
    onSuccess: async (data: any) => {
      const result = data.createLote;
      toast.success("Lote created successfully");
      form.reset({
        name: result.name,
        description: result.description ?? "",
      });
      await queryClient.invalidateQueries({ queryKey: ["lote-list"] });
      await navigate({ to: "/lotes/$id", params: { id: result.id } });
    },
    onError: err => {
      toast.error("Failed to create lote", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: LoteFormValues) => api.mutate(updateLoteDocument, { id: params.id, input }),
    onSuccess: async (data: any) => {
      const result = data.updateLote;
      toast.success("Lote updated successfully");
      form.reset({
        name: result.name,
        description: result.description ?? "",
      });
      await queryClient.invalidateQueries({ queryKey: ["lote-detail", params.id] });
      await queryClient.invalidateQueries({ queryKey: ["lote-list"] });
    },
    onError: err => {
      toast.error("Failed to update lote", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.mutate(deleteLoteDocument, { id: params.id }),
    onSuccess: async () => {
      toast.success("Lote deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["lote-list"] });
      await navigate({ to: "/lotes" });
    },
    onError: err => {
      toast.error("Failed to delete lote", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Page
      pageId="lote-detail"
      form={form}
      submitHandler={form.handleSubmit(values => {
        if (creatingNewEntity) {
          createMutation.mutate(values);
        } else {
          updateMutation.mutate(values);
        }
      })}
    >
      <PageTitle>{creatingNewEntity ? "New lote" : detailQuery.data?.getLote?.name ?? "Lote"}</PageTitle>
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
        <PageBlock column="main" blockId="main-form" title="Lote details">
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              rules={{ required: "Name is required" }}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="description"
              label="Description"
              render={({ field }) => <Textarea {...field} value={field.value ?? ""} />}
            />
          </DetailFormGrid>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
