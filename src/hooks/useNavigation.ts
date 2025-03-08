import { useRouter } from "next/navigation";
import {
  NavigationService,
  INavigationService,
} from "@/services/navigation/service";

export const useNavigation = (): INavigationService => {
  const router = useRouter();

  return new NavigationService(router);
};
