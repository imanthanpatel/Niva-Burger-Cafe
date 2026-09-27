import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch } from 'wouter';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;