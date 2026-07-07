import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, DialogComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Users</h2>
        <p class="text-sm text-gray-500 mt-1">{{ filteredUsers().length }} users</p>
      </div>

      <!-- Search -->
      <div class="relative max-w-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" placeholder="Search users..." [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)"
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444] transition-colors" />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
                <th class="px-4 py-3 font-medium">User</th>
                <th class="px-4 py-3 font-medium">Email</th>
                <th class="px-4 py-3 font-medium">Phone</th>
                <th class="px-4 py-3 font-medium">Role</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium">Joined</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers(); track user.id) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[#DB4444] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-medium text-gray-900">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ user.email }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ user.phone || '—' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="user.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                      {{ user.blocked ? 'Blocked' : 'Active' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ user.createdAt | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="toggleRole(user)"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                        [class]="user.role === 'admin' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'">
                        {{ user.role === 'admin' ? 'Demote' : 'Make Admin' }}
                      </button>
                      <button (click)="toggleBlock(user)"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                        [class]="user.blocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'">
                        {{ user.blocked ? 'Unblock' : 'Block' }}
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-4 py-10 text-center text-gray-500">No users found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Block Confirmation -->
    <app-dialog [open]="blockDialogOpen()" [title]="'Confirm ' + (blockTarget()?.blocked ? 'Unblock' : 'Block')" (close)="blockDialogOpen.set(false)">
      @if (blockTarget(); as user) {
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to <strong>{{ user.blocked ? 'unblock' : 'block' }}</strong> <strong>{{ user.name }}</strong>?
          {{ user.blocked ? 'They will be able to log in again.' : 'They will not be able to log in.' }}
        </p>
        <div class="flex justify-end gap-3">
          <button (click)="blockDialogOpen.set(false)" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
          <button (click)="doToggleBlock()"
            class="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
            [class]="user.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'">
            {{ user.blocked ? 'Unblock' : 'Block' }}
          </button>
        </div>
      }
    </app-dialog>
  `,
})
export class AdminUsersComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly searchQuery = signal('');
  readonly users = signal<User[]>([]);
  readonly blockDialogOpen = signal(false);
  readonly blockTarget = signal<User | null>(null);
  readonly roleTarget = signal<User | null>(null);

  ngOnInit() {
    this.refreshUsers();
  }

  readonly filteredUsers = () => {
    const q = this.searchQuery().toLowerCase();
    return this.users().filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  };

  private refreshUsers() {
    this.users.set(this.authService.getAllUsers());
  }

  toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const updated = this.authService.updateUserRole(user.id, newRole);
    if (updated) {
      this.refreshUsers();
      toast.success(`${user.name} is now ${newRole}`);
    }
  }

  toggleBlock(user: User) {
    this.blockTarget.set(user);
    this.blockDialogOpen.set(true);
  }

  doToggleBlock() {
    const user = this.blockTarget();
    if (!user) return;
    this.authService.toggleBlockUser(user.id);
    this.refreshUsers();
    toast.success(`${user.name} ${user.blocked ? 'unblocked' : 'blocked'}`);
    this.blockDialogOpen.set(false);
    this.blockTarget.set(null);
  }
}
