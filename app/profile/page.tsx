"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { User, Trash2 } from "lucide-react"

interface ProfileFormData {
  name: string
  email: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile, deleteAccount } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user, isLoading, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Помилка",
        description: "Паролі не співпадають",
        variant: "destructive",
      })
      return
    }

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        ...(formData.currentPassword && { currentPassword: formData.currentPassword }),
        ...(formData.newPassword && { newPassword: formData.newPassword }),
      })

      toast({
        title: "Успіх",
        description: "Профіль оновлено успішно",
      })
      setIsEditing(false)
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося оновити профіль",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount()
      toast({
        title: "Акаунт видалено",
        description: "Ваш акаунт було успішно видалено",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося видалити акаунт",
        variant: "destructive",
      })
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-coffee-50/30">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold font-serif mb-8 text-coffee-800">
            {language === "uk" ? "Мій профіль" : "My Profile"}
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {language === "uk" ? "Інформація профілю" : "Profile Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">{language === "uk" ? "Ім'я" : "Name"}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{language === "uk" ? "Електронна пошта" : "Email"}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="currentPassword">{language === "uk" ? "Поточний пароль" : "Current Password"}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword || ""}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">{language === "uk" ? "Новий пароль" : "New Password"}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword || ""}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">
                    {language === "uk" ? "Підтвердження пароля" : "Confirm Password"}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex justify-between">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button type="submit">{language === "uk" ? "Зберегти" : "Save"}</Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        {language === "uk" ? "Скасувати" : "Cancel"}
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      {language === "uk" ? "Редагувати" : "Edit"}
                    </Button>
                  )}
                  <Button type="button" onClick={handleDeleteAccount} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {language === "uk" ? "Видалити акаунт" : "Delete Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "uk" ? "Видалити акаунт" : "Delete Account"}</DialogTitle>
            <DialogDescription>
              {language === "uk"
                ? "Ви впевнені, що хочете видалити акаунт? Цю дію неможливо скасувати."
                : "Are you sure you want to delete your account? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              {language === "uk" ? "Скасувати" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              {language === "uk" ? "Видалити" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
