package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.SplitType;

import java.util.List;

public class SaveItemAllocationsRequestDTO {
    private SplitType splitType;
    private List<AllocationEntryDTO> entries;

    public SaveItemAllocationsRequestDTO() {
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }

    public List<AllocationEntryDTO> getEntries() {
        return entries;
    }

    public void setEntries(List<AllocationEntryDTO> entries) {
        this.entries = entries;
    }

    public static class AllocationEntryDTO {
        private Long participantId;
        // BY_QUANTITY için: bu katılımcıya verilen adet.
        private Integer quantity;
        // MANUAL için: bu katılımcıya girilen ₺ tutarı.
        private Double amount;

        public AllocationEntryDTO() {
        }

        public Long getParticipantId() {
            return participantId;
        }

        public void setParticipantId(Long participantId) {
            this.participantId = participantId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }
    }
}
