import {
  Home,
  Package,
  Tag,
  Wallet,
  Users,
  Truck,
  Calculator,
  Search,
  MessageCircle,
  Store,
  RefreshCw,
  ImageIcon,
  Share2,
  Settings,
  BookOpen,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  pro?: boolean;
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
      { key: "clientes", label: "Clientes", icon: Users },
      { key: "fornecedores", label: "Fornecedores", icon: Truck },
    ],
  },
  {
    label: "Utilitários",
    items: [
      { key: "calc", label: "Calculadora de Lucro", icon: Calculator },
      { key: "imei", label: "Consulta de IMEI", icon: Search },
    ],
  },
  {
    label: "Recursos PRO",
    items: [
      { key: "bree", label: "Bree — Assistente IA", icon: MessageCircle, pro: true },
      { key: "loja", label: "Loja Virtual", icon: Store, pro: true },
      { key: "migracao", label: "Migração com IA", icon: RefreshCw, pro: true },
      { key: "imagens", label: "Imagens com IA", icon: ImageIcon, pro: true },
      { key: "afiliado", label: "Painel do Afiliado", icon: Share2, pro: true },
    ],
  },
  {
    label: "Conta",
    items: [
      { key: "config", label: "Configuração da Conta", icon: Settings },
      { key: "tutoriais", label: "Tutoriais", icon: BookOpen },
      { key: "assinatura", label: "Assinatura", icon: CreditCard },
    ],
  },
];
