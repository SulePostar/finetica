import React, { useState } from 'react';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CircleImage from '@/components/profilePage/CircleImage';
import PageTitle from '@/components/shared-ui/PageTitle';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 md:p-6 xl:p-8">
      <div className="max-w-4xl w-full">
        <Card className="shadow-xl border-border bg-card text-card-foreground">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
              <div className="w-full md:w-auto">
                <CardTitle className="text-2xl md:text-3xl font-bold text-heading-color">
                  <PageTitle text="User Profile" className="-mt-5" />
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isEditing ? 'Edit your profile information' : 'View and manage your profile'}
                </p>
              </div>
              <Button
                className="w-full md:w-auto bg-spurple text-white hover:bg-spurple/90"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Dialog>
              {isEditing ? (
                <DialogTrigger asChild>
                  <div className="flex flex-col sm:flex-row items-center sm:items-end py-5 px-4 bg-muted rounded-lg gap-4 sm:gap-6 cursor-pointer w-full text-center sm:text-left">
                    <CircleImage
                      src={null}
                      alt="User Profile Photo"
                      size="small"
                      borderColor="border-transparent"
                      showEditIcon={isEditing}
                    />
                    <div className="space-y-1 sm:space-y-0 sm:pb-1">
                      <h3 className="font-semibold text-foreground text-lg">Profile Picture</h3>
                      <p className="text-muted-foreground text-sm">
                        Upload a professional photo that represents you
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
              ) : (
                <div className="flex flex-col sm:flex-row items-center sm:items-end py-5 px-4 bg-muted rounded-lg gap-4 sm:gap-6 cursor-pointer w-full text-center sm:text-left opacity-70">
                  <CircleImage
                    src={null}
                    alt="User Profile Photo"
                    size="small"
                    borderColor="border-transparent"
                    showEditIcon={false}
                  />
                  <div className="space-y-1 sm:space-y-0 sm:pb-1">
                    <h3 className="font-semibold text-foreground text-lg">Profile Picture</h3>
                    <p className="text-muted-foreground text-sm">
                      Upload a professional photo that represents you
                    </p>
                  </div>
                </div>
              )}
              <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-xl shadow-2xl border border-border p-6">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-xl font-semibold text-heading-color">
                    Update Profile Photo
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-8 py-6">
                  <div className="relative group">
                    <CircleImage
                      src={null}
                      alt="User Profile Photo"
                      size="medium"
                      borderColor="border-transparent"
                      className="cursor-default"
                    />
                    <div className="absolute inset-0 rounded-full ring-1 ring-border/40 pointer-events-none" />
                  </div>
                  <div className="w-full space-y-2">
                    <Dropzone
                      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                      maxSize={10 * 1024 * 1024}
                      maxFiles={1}
                      className="w-full"
                      name="profile_image"
                    >
                      <DropzoneContent />
                      <DropzoneEmptyState />
                    </Dropzone>
                  </div>
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2">
                  <Button variant="destructive" className="w-full sm:w-auto dark:hover:bg-destructive/90">
                    Remove Photo
                  </Button>
                  <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full sm:w-auto border-border text-muted-foreground hover:bg-muted/50">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button className="w-full sm:w-auto bg-spurple text-white hover:bg-spurple/90 shadow-md">
                      Confirm
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <form className="space-y-6">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" defaultValue="Zdravko" disabled={!isEditing} readOnly={!isEditing} className={!isEditing ? 'bg-muted cursor-not-allowed' : ''}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" defaultValue="Čolić" disabled={!isEditing} readOnly={!isEditing} className={!isEditing ? 'bg-muted cursor-not-allowed' : ''}
                    />
                  </Field>
                </div>
              </FieldGroup>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value="zdravko@example.com" disabled readOnly={true} className="bg-muted cursor-not-allowed"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" value="Administrator" disabled readOnly={true} className="bg-muted cursor-not-allowed"
                    />
                  </Field>
                </div>
              </FieldGroup>
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  <Button className="sm:w-auto w-full bg-spurple text-white hover:bg-spurple/90">
                    Save Changes
                  </Button>
                </div>
              )}
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <Field>
                    <Label>Account Status</Label>
                    <div className="flex items-center h-10">
                      <Badge className="bg-green text-green-foreground hover:bg-green/90">Approved</Badge>
                    </div>
                  </Field>
                  <Field>
                    <Label htmlFor="lastLogin">Last Login</Label>
                    <Input id="last_login_at" name="last_login_at" value="Dec 11, 2024, 2:30 PM" disabled className="bg-muted cursor-not-allowed"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;