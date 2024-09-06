<template>
  <div>
    <UModal v-model="isOpen">
      <UCard>
        <template #header> Add Transaction </template>
        <UForm :state="state" :schema="schema" ref="form" @submit="saveForm">
          <UFormGroup
            label="Transaction type"
            :required="true"
            name="type"
            class="mb-4"
          >
            <USelect
              placeholder="Transaction type"
              :options="types"
              v-model="state.type"
            />
          </UFormGroup>

          <UFormGroup
            label="Amount"
            :required="true"
            name="amount"
            class="mb-4"
          >
            <UInput
              type="number"
              placeholder="Amount"
              v-model.number="state.amount"
            />
          </UFormGroup>

          <UFormGroup
            label="Transaction Date"
            :required="true"
            name="created_at"
            class="mb-4"
          >
            <UInput
              type="date"
              icons="i-heroicons-calendar-days-20-solid"
              v-model="state.created_at"
            />
          </UFormGroup>

          <UFormGroup
            label="Description"
            hint="Optional"
            name="description"
            class="mb-4"
          >
            <UInput placeholder="Description" v-model="state.description" />
          </UFormGroup>

          <UFormGroup
            label="Category"
            :required="true"
            name="category"
            class="mb-4"
            v-if="state.type === 'Expense'"
          >
            <USelect
              placeholder="Category"
              :options="categories"
              v-model="state.category"
            />
          </UFormGroup>

          <UButton type="submit" color="black" variant="solid" label="Save" />
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { categories, types } from "~/constants";

const props = defineProps({
  modelValue: Boolean,
});

const emits = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emits("update:modelValue", value);
  },
});

const form = ref();

const initialState = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const state = ref({
  ...initialState,
});

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amounts need to be more than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});

const savingSchema = z.object({
  type: z.literal("Saving"),
});

const investmentSchema = z.object({
  type: z.literal("Investment"),
});

const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const schema = z.intersection(
  defaultSchema,
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ])
);

function saveForm() {}

function resetForm() {
  Object.assign(state.value, initialState);
  form.value?.clear();
}
</script>

<style scoped></style>
