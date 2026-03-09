import { Pipe, PipeTransform } from '@angular/core';
import { Doctor } from '../models/doctor.model';

@Pipe({ name: 'filterDoctors', standalone: true, pure: false })
export class FilterDoctorsPipe implements PipeTransform {
  transform(doctors: Doctor[], specialization: string, search: string): Doctor[] {
    if (!doctors) return [];
    return doctors.filter(d => {
      const matchSpec = !specialization || specialization === 'All' || d.specialization === specialization;
      const term = (search || '').toLowerCase();
      const matchSearch = !term ||
        d.name.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term) ||
        d.hospital.toLowerCase().includes(term);
      return matchSpec && matchSearch;
    });
  }
}
