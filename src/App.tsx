import { Board } from "./Board.tsx";
import {
  QueryClientProvider,
  QueryClient,
  MutationCache,
  onlineManager,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "./loader.tsx";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: () => !queryClient.isMutating(),
    },
  },
  mutationCache: new MutationCache({
    onSettled: () => {
      if (queryClient.isMutating() === 1) {
        return queryClient.invalidateQueries();
      }
    },
  }),
});

export function useOfflineIndicator() {
  useEffect(() => {
    return onlineManager.subscribe(() => {
      if (onlineManager.isOnline()) {
        toast.success("online", {
          id: "ReactQuery",
          duration: 2000,
        });
      } else {
        toast.error("offline", {
          id: "ReactQuery",
          duration: Infinity,
        });
      }
    });
  }, []);
}

function App() {
  useOfflineIndicator();
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border">
        <div className="block leading-3 w-1/3">
          <div className="font-black text-2xl text-white">Trellix-Query</div>
          <div className="text-slate-500">a React Query Demo</div>
        </div>
        <div className="flex items-center gap-6">
          <IconLink
            href="https://github.com/tkdodo/trellix-query"
            label="Source"
            icon="/github-mark-white.png"
          />
          <IconLink
            href="https://tanstack.com/query/latest"
            icon="/tanstack.png"
            label="Docs"
          />
        </div>
      </div>

      <div className="flex-grow min-h-0 h-full">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loader />}>
            <Board />
          </Suspense>
          <ReactQueryDevtools />
        </QueryClientProvider>
        <Toaster />
      </div>
    </div>
  );
}

function IconLink({
  icon,
  href,
  label,
}: {
  icon: string;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="text-slate-500 text-xs uppercase font-bold text-center"
    >
      <img src={icon} aria-hidden className="inline-block h-8 rounded-full" />
      <span className="block mt-2">{label}</span>
    </a>
  );
}

export default App;
