<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="totalIncome"
      :last-amount="5000"
      :loading="status === 'pending'"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="totalExpenses"
      :last-amount="2000"
      :loading="status === 'pending'"
    />
    <Trend
      color="green"
      title="Investment"
      :amount="4000"
      :last-amount="3000"
      :loading="status === 'pending'"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="6000"
      :loading="status === 'pending'"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      ></UButton>
    </div>
  </section>

  <section v-if="status !== 'pending'">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
    >
      <DailyTransactionSummary :transactions="transactionsOnDay" :date="date" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="hanleDeleteTransaction"
      />
    </div>
  </section>

  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" />
  </section>
</template>

<script setup lang="ts">
import TransactionModal from "~/components/TransactionModal.vue";
import { transactionViewOptions } from "~~/constants";

const isOpen = ref(false);
const selectedView = ref(transactionViewOptions[1]);
const transactions = ref<any[] | null>([]);
const supabase = useSupabaseClient();

const { data, status, refresh } = await useAsyncData(
  "transactions",
  async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select()
      .order("created_at", { ascending: false });

    if (error) return [];
    return data;
  }
);

transactions.value = data.value;

const incomeCount = computed(() => {
  return transactions.value?.filter((transaction) => {
    return transaction.type === "Income";
  }).length;
});

const expenseCount = computed(() => {
  return transactions.value?.filter((transaction) => {
    return transaction.type === "Expenses";
  }).length;
});

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value!!) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(transaction);
  }

  return grouped;
});

async function hanleDeleteTransaction() {
  await refresh();
  transactions.value = data.value;
}

const totalIncome = ref(0);
const totalExpenses = ref(0);

const { data: newData } = await useFetch(`/api/getTotalAmount`, {
  params: { year: 2024, month: 9 },
});

if (newData.value) {
  totalIncome.value = newData.value[0]?.total_income || 0;
  totalExpenses.value = newData.value[0]?.total_expenses || 0;
}
</script>

<style scoped></style>
