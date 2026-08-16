import {
  Home,
  Package,
  Tag,
  Wallet,
  Users,
  Truck,
  Calculator,
  Search,
  Settings,
  CreditCard,
  QrCode,
  Wrench,
  FileBarChart,
  UsersRound,
  HardDriveDownload,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  pro?: boolean;
  isNew?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Operação",
    items: [
      { key: "inicio", label: "Início", icon: Home },
      { key: "produtos", label: "Produtos", icon: Package },
      { key: "vendas", label: "Vendas", icon: Tag },
      { key: "financeiro", label: "Financeiro", icon: Wallet },
    ],
  },
  {
    label: "Recursos PRO",
    items: [
      { key: "clientes", label: "Clientes", icon: Users, pro: true },
      { key: "fornecedores", label: "Fornecedores", icon: Truck, pro: true },
      { key: "calc", label: "Calculadora de Lucro", icon: Calculator, pro: true },
      { key: "imei", label: "Consulta de IMEI", icon: Search, pro: true },
      { key: "pix", label: "Gerador de QR PIX", icon: QrCode, pro: true },
      { key: "os", label: "Ordens de Serviço", icon: Wrench, pro: true },
      { key: "relatorios", label: "Relatórios Avançados", icon: FileBarChart, pro: true },
      { key: "backup", label: "Backup de Dados", icon: HardDriveDownload, pro: true },
      { key: "equipe", label: "Multiusuário", icon: UsersRound, pro: true },
    ],
  },
  {
    label: "Conta",
    items: [
      { key: "config", label: "Configuração da Conta", icon: Settings },
      { key: "assinatura", label: "Assinatura", icon: CreditCard },
    ],
  },
];
