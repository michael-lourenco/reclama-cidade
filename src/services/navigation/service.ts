export interface INavigationService {
  navigateTo: (path: string) => void;
}

export class NavigationService implements INavigationService {
  constructor(private router: any) {}

  navigateTo(path: string): void {
    this.router.push(path);
  }
}
