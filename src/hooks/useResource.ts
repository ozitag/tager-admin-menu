import { computed, Ref, ref, SetupContext } from '@vue/composition-api';
import {
  FETCH_STATUSES,
  FetchStatus,
  getMessageFromError,
  ResponseBody,
} from '@tager/admin-services';

function useResource<T>(params: {
  fetchResource: () => Promise<ResponseBody<T>>;
  initialValue: T;
  resourceName?: string;
  context: SetupContext;
}) {
  const data = ref<T>(params.initialValue);
  const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
  const error = ref<string | null>(null);

  const loading = computed(() => status.value === FETCH_STATUSES.LOADING);

  function refreshEntityList(): Promise<void> {
    status.value = FETCH_STATUSES.LOADING;

    return params
      .fetchResource()
      .then((response) => {
        (data as Ref<T>).value = response.data;
        status.value = FETCH_STATUSES.SUCCESS;
        error.value = null;
      })
      .catch((error) => {
        console.error(error);

        const resourceName = params.resourceName ?? 'Resource';
        params.context.root.$toast({
          variant: 'danger',
          title: 'Error',
          body: `${resourceName} fetching has been failed`,
        });

        (data as Ref<T>).value = params.initialValue;
        status.value = FETCH_STATUSES.FAILURE;
        error.value = getMessageFromError(error);
      });
  }

  return [refreshEntityList, { data, loading, error, status }] as const;
}

export default useResource;
