import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useFilterTypes } from "@/hooks/use-filter-types"
import { addFilterValue, deleteFilterValue } from "@/lib/filter-types-admin"
import { getErrorMessage } from "@/lib/utils"

// /admin/filter-types — Color/Material/Size/Shape/Roof values
// (07-ADMIN-DASHBOARD-SPEC.md: "admin-editable, no developer needed to add a
// new value"). Editing/removing a value is delete-and-re-add rather than a
// separate edit mode, to keep this page to one screen.
export function AdminFilterTypesList() {
  const { filterGroups, isLoading, error } = useFilterTypes()
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeValue, setNewTypeValue] = useState("")
  const [newValueByGroup, setNewValueByGroup] = useState<Record<string, string>>({})
  const [actionError, setActionError] = useState<string | null>(null)

  function refresh() {
    window.location.reload()
  }

  async function handleAddValue(filterType: string, value: string) {
    if (!value.trim()) return
    setActionError(null)
    try {
      const existingCount = filterGroups[filterType]?.length ?? 0
      await addFilterValue(filterType, value.trim(), existingCount)
      refresh()
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to add value"))
    }
  }

  async function handleAddType(event: FormEvent) {
    event.preventDefault()
    if (!newTypeName.trim() || !newTypeValue.trim()) return
    await handleAddValue(newTypeName.trim().toLowerCase(), newTypeValue.trim())
  }

  async function handleDelete(id: string) {
    setActionError(null)
    try {
      await deleteFilterValue(id)
      refresh()
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to delete value"))
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl">Filter Types</h1>

      {actionError && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {actionError}
        </p>
      )}

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(filterGroups).map(([filterType, values]) => (
            <div key={filterType}>
              <h2 className="mb-3 text-lg font-medium capitalize">{filterType}</h2>
              <div className="flex flex-col divide-y divide-border border-t border-b border-border">
                {values.map((option) => (
                  <div key={option.id} className="flex items-center justify-between py-2">
                    <span>{option.value}</span>
                    <button
                      type="button"
                      onClick={() => void handleDelete(option.id)}
                      className="text-sm text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  void handleAddValue(filterType, newValueByGroup[filterType] ?? "")
                }}
              >
                <Input
                  placeholder="New value"
                  value={newValueByGroup[filterType] ?? ""}
                  onChange={(e) => setNewValueByGroup((prev) => ({ ...prev, [filterType]: e.target.value }))}
                />
                <Button type="submit" variant="outline">
                  Add
                </Button>
              </form>
            </div>
          ))}

          <div className="rounded-lg border border-border p-4">
            <h2 className="mb-3 text-lg font-medium">Add a New Filter Type</h2>
            <form onSubmit={handleAddType} className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Type name (e.g. finish)"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <Input
                placeholder="First value"
                value={newTypeValue}
                onChange={(e) => setNewTypeValue(e.target.value)}
              />
              <Button type="submit" variant="outline" className="shrink-0">
                Create
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
