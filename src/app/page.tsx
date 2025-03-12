

'use client'
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar/Navbar"), { ssr: false });
const Transaction = dynamic(() => import("@/components/Home/Transactions"), { ssr: false });
const MonthlyExpensesChart = dynamic(() => import("@/components/Home/MonthlyExpensesChart"), { ssr: false });
const CategoryWisePieChart = dynamic(() => import("@/components/Home/CategoryWisePieChart"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Home/Dashboard"), { ssr: false });
const SetBudget = dynamic(() => import("@/components/Home/SetBudget"), { ssr: false });
const BudgetVsActualChart = dynamic(() => import("@/components/Home/BudgetVsActualChart"), { ssr: false });
const SpendingInsights = dynamic(() => import("@/components/Home/SpendingInsights"), { ssr: false });

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Transaction />
      <MonthlyExpensesChart />
      <CategoryWisePieChart />
      <Dashboard />
      <SetBudget />
      <BudgetVsActualChart />
      <SpendingInsights />
    </div>
  );
}
