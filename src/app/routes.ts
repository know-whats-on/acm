import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { UnitsPage } from './pages/units';
import { UnitDetailPage } from './pages/unit-detail';
import { AssessmentPage } from './pages/assessment';
import { TrackerPage } from './pages/tracker';
import { BadgesPage } from './pages/badges';
import { LogsPage } from './pages/logs';
import { ExportPage } from './pages/export';
import { SettingsPage } from './pages/settings';
import { MorePage } from './pages/more';
import { AssessorPage } from './pages/assessor';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'units', Component: UnitsPage },
      { path: 'units/:unitId', Component: UnitDetailPage },
      { path: 'units/:unitId/assessment/:assessmentId', Component: AssessmentPage },
      { path: 'tracker', Component: TrackerPage },
      { path: 'badges', Component: BadgesPage },
      { path: 'logs', Component: LogsPage },
      { path: 'export', Component: ExportPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'more', Component: MorePage },
      { path: 'assessor', Component: AssessorPage },
    ],
  },
]);
