"use client";

import { useState } from "react";
import { Plus, Trash2, Phone, User } from "lucide-react";
import { TrustedContact } from "@/lib/types";
import { InputWithLabel } from "./InputWithLabel";
import { Modal, ConfirmationModal } from "./Modal";
import {
  generateContactId,
  validatePhoneNumber,
  formatPhoneNumber,
} from "@/lib/utils";

interface TrustedContactsManagerProps {
  contacts: TrustedContact[];
  onContactsChange: (contacts: TrustedContact[]) => void;
}

export function TrustedContactsManager({
  contacts,
  onContactsChange,
}: TrustedContactsManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newContact.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newContact.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(newContact.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!newContact.relationship.trim()) {
      newErrors.relationship = "Relationship is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    if (!validateForm()) return;

    const contact: TrustedContact = {
      contactId: generateContactId(),
      userId: "current-user", // This would come from auth context
      name: newContact.name.trim(),
      phoneNumber: newContact.phoneNumber.trim(),
      relationship: newContact.relationship.trim(),
    };

    onContactsChange([...contacts, contact]);
    setNewContact({ name: "", phoneNumber: "", relationship: "" });
    setErrors({});
    setIsAddModalOpen(false);
  };

  const handleDeleteContact = (contactId: string) => {
    onContactsChange(contacts.filter((c) => c.contactId !== contactId));
    setDeleteContactId(null);
  };

  const relationshipOptions = [
    { value: "family", label: "Family Member" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner/Spouse" },
    { value: "lawyer", label: "Lawyer" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Emergency Contacts
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <User className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Emergency Contacts
          </h3>
          <p className="text-text-secondary mb-4">
            Add trusted contacts who will be notified during emergencies.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <div key={contact.contactId} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-text-secondary capitalize">
                      {contact.relationship}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
                    title="Call contact"
                  >
                    <Phone className="h-4 w-4 text-green-400" />
                  </a>
                  <button
                    onClick={() => setDeleteContactId(contact.contactId)}
                    className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
                    title="Delete contact"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm text-text-secondary">
                {formatPhoneNumber(contact.phoneNumber)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewContact({ name: "", phoneNumber: "", relationship: "" });
          setErrors({});
        }}
        title="Add Emergency Contact"
        actions={
          <>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleAddContact} className="btn-primary">
              Add Contact
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <InputWithLabel
            label="Full Name"
            variant="text"
            placeholder="Enter contact's full name"
            value={newContact.name}
            onChange={(value) =>
              setNewContact((prev) => ({ ...prev, name: value }))
            }
            required
            error={errors.name}
          />

          <InputWithLabel
            label="Phone Number"
            variant="tel"
            placeholder="(555) 123-4567"
            value={newContact.phoneNumber}
            onChange={(value) =>
              setNewContact((prev) => ({ ...prev, phoneNumber: value }))
            }
            required
            error={errors.phoneNumber}
          />

          <InputWithLabel
            label="Relationship"
            variant="select"
            placeholder="Select relationship"
            value={newContact.relationship}
            onChange={(value) =>
              setNewContact((prev) => ({ ...prev, relationship: value }))
            }
            options={relationshipOptions}
            required
            error={errors.relationship}
          />

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              <strong>Note:</strong> These contacts will receive your location
              and incident details when you trigger an emergency alert.
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteContactId !== null}
        onClose={() => setDeleteContactId(null)}
        onConfirm={() =>
          deleteContactId && handleDeleteContact(deleteContactId)
        }
        title="Delete Contact"
        message="Are you sure you want to remove this emergency contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
      />
    </div>
  );
}
