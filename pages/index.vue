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
      :amount="4000"
      :last-amount="5000"
      :oading="false"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="4000"
      :last-amount="2000"
      :loading="false"
    />
    <Trend
      color="green"
      title="Investment"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="6000"
      :loading="false"
    />
  </section>

  <section>
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
    >
      <DailyTransactionSummary :transactions="transactionsOnDay" :date="date" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { transactionViewOptions } from "~~/constants";

const selectedView = ref(transactionViewOptions[1]);
const transactions = ref<any[] | null>([]);
const supabase = useSupabaseClient();

const { data, pending } = await useAsyncData("transactions", async () => {
  const { data, error } = await supabase.from("transactions").select();
  console.log(data);

  if (error) return [];
  return data;
});

transactions.value = data.value;

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

console.log(transactionsGroupedByDate.value);
</script>

<style scoped></style>
